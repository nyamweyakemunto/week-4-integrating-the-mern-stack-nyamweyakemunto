const { body, validationResult } = require('express-validator');

exports.validateTask = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title must be less than 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  
  body('priority')
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
  
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    next();
  }
];