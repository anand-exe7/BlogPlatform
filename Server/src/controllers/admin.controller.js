// USER MANAGEMENT CONTROLLERS

// List pending users
const getPendingUsers = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, reg_no, year, domain, ref_code, 
              status, role, created_at 
       FROM users 
       WHERE status = 'pending' 
       ORDER BY created_at DESC`
    );
    
    res.json({
      success: true,
      count: result.rows.length,
      users: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

// Approve user
const approveUser = async (req, res, next) => {
  const { id } = req.params;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Update user status
    const result = await client.query(
      `UPDATE users 
       SET status = 'approved', updated_at = NOW() 
       WHERE id = $1 AND status = 'pending' 
       RETURNING id, name, email`,
      [id]
    );
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ 
        error: 'User not found or already processed' 
      });
    }
    
    const user = result.rows[0];
    
    // Send approval email
    await sendEmail(
      user.email,
      'Account Approved',
      emailTemplates.userApproval(user.name)
    );
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      message: 'User approved successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

// BLOG MANAGEMENT CONTROLLERS

// Get all blogs (with optional status filter)
const getAllBlogs = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    let query = `
      SELECT b.id, b.title, b.content, b.links, b.status, 
             b.created_at, b.updated_at,
             u.id as author_id, u.name as author_name, u.email as author_email
      FROM blogs b
      JOIN users u ON b.author_id = u.id
    `;
    
    const params = [];
    
    if (status) {
      query += ' WHERE b.status = $1';
      params.push(status);
    }
    
    query += ' ORDER BY b.created_at DESC';
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      count: result.rows.length,
      blogs: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

// Approve and publish blog
const approveBlog = async (req, res, next) => {
  const { id } = req.params;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Update blog status
    const result = await client.query(
      `UPDATE blogs 
       SET status = 'published', updated_at = NOW() 
       WHERE id = $1 AND status = 'pending_review' 
       RETURNING id, title, author_id`,
      [id]
    );
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ 
        error: 'Blog not found or already processed' 
      });
    }
    
    const blog = result.rows[0];
    
    // Get author email
    const authorResult = await client.query(
      'SELECT email, name FROM users WHERE id = $1',
      [blog.author_id]
    );
    
    if (authorResult.rows.length > 0) {
      const author = authorResult.rows[0];
      await sendEmail(
        author.email,
        'Blog Post Approved',
        emailTemplates.blogApproval(blog.title)
      );
    }
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      message: 'Blog approved and published successfully',
      blog: {
        id: blog.id,
        title: blog.title,
        status: 'published',
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

// Reject blog with reason
const rejectBlog = async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;
  
  if (!reason || reason.trim() === '') {
    return res.status(400).json({ 
      error: 'Rejection reason is required' 
    });
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Update blog status
    const result = await client.query(
      `UPDATE blogs 
       SET status = 'rejected', updated_at = NOW() 
       WHERE id = $1 AND status = 'pending_review' 
       RETURNING id, title, author_id`,
      [id]
    );
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ 
        error: 'Blog not found or already processed' 
      });
    }
    
    const blog = result.rows[0];
    
    // Store rejection reason
    await client.query(
      `UPDATE blogs SET rejection_reason = $1 WHERE id = $2`,
      [reason, id]
    );
    
    // Get author email
    const authorResult = await client.query(
      'SELECT email, name FROM users WHERE id = $1',
      [blog.author_id]
    );
    
    if (authorResult.rows.length > 0) {
      const author = authorResult.rows[0];
      await sendEmail(
        author.email,
        'Blog Post Update',
        emailTemplates.blogRejection(blog.title, reason)
      );
    }
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      message: 'Blog rejected successfully',
      blog: {
        id: blog.id,
        title: blog.title,
        status: 'rejected',
        reason,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};