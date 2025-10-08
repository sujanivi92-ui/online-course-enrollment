import { useState, useEffect } from 'react'

// Mock data for courses
const COURSES_DATA = [
  { id: 1, name: 'Web Development Bootcamp', duration: '12 weeks', fees: 499 },
  { id: 2, name: 'Data Science Fundamentals', duration: '10 weeks', fees: 599 },
  { id: 3, name: 'Mobile App Development', duration: '8 weeks', fees: 449 },
  { id: 4, name: 'UI/UX Design Masterclass', duration: '6 weeks', fees: 399 },
  { id: 5, name: 'Digital Marketing Strategy', duration: '4 weeks', fees: 299 },
  { id: 6, name: 'Cloud Computing Essentials', duration: '8 weeks', fees: 549 }
]

// Mock existing emails for validation
const EXISTING_EMAILS = ['student@example.com', 'test@university.edu', 'john.doe@email.com']

const CourseEnrollmentForm = () => {
  // Form steps
  const [currentStep, setCurrentStep] = useState(1)
  
  // Student details
  const [studentDetails, setStudentDetails] = useState({
    name: '',
    email: '',
    country: '',
    gender: ''
  })

  // Course selection
  const [courses, setCourses] = useState([
    { id: Date.now(), courseId: '', duration: '', fees: '' }
  ])

  // Validation and status
  const [errors, setErrors] = useState({})
  const [emailStatus, setEmailStatus] = useState('') // '', 'checking', 'available', 'taken'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Email validation with debounce
  useEffect(() => {
    if (!studentDetails.email) {
      setEmailStatus('')
      return
    }

    if (!studentDetails.email.includes('@')) {
      setEmailStatus('')
      return
    }

    setEmailStatus('checking')
    
    const timer = setTimeout(() => {
      const isTaken = EXISTING_EMAILS.includes(studentDetails.email.toLowerCase())
      setEmailStatus(isTaken ? 'taken' : 'available')
    }, 1500)

    return () => clearTimeout(timer)
  }, [studentDetails.email])

  // Handle student details change
  const handleStudentDetailsChange = (e) => {
    const { name, value } = e.target
    setStudentDetails(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle course change
  const handleCourseChange = (index, field, value) => {
    const updatedCourses = courses.map((course, i) => {
      if (i === index) {
        if (field === 'courseId') {
          const selectedCourse = COURSES_DATA.find(c => c.id === parseInt(value))
          return {
            ...course,
            courseId: value,
            duration: selectedCourse ? selectedCourse.duration : '',
            fees: selectedCourse ? selectedCourse.fees : ''
          }
        }
        return { ...course, [field]: value }
      }
      return course
    })
    setCourses(updatedCourses)
  }

  // Add new course
  const addCourse = () => {
    setCourses(prev => [
      ...prev,
      { id: Date.now() + Math.random(), courseId: '', duration: '', fees: '' }
    ])
  }

  // Remove course
  const removeCourse = (index) => {
    if (courses.length > 1) {
      setCourses(prev => prev.filter((_, i) => i !== index))
    }
  }

  // Validation functions
  const validateStep1 = () => {
    const newErrors = {}

    if (!studentDetails.name.trim()) {
      newErrors.name = 'Full name is required'
    }

    if (!studentDetails.email) {
      newErrors.email = 'Email is required'
    } else if (!studentDetails.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address'
    } else if (emailStatus === 'taken') {
      newErrors.email = 'This email is already registered'
    }

    if (!studentDetails.country) {
      newErrors.country = 'Please select your country'
    }

    if (!studentDetails.gender) {
      newErrors.gender = 'Please select your gender'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}
    const courseErrors = []

    courses.forEach((course, index) => {
      if (!course.courseId) {
        courseErrors[index] = 'Please select a course'
      }
    })

    if (courseErrors.length > 0) {
      newErrors.courses = courseErrors
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Navigation functions
  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  // Form submission
  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  // Reset form
  const resetForm = () => {
    setStudentDetails({
      name: '',
      email: '',
      country: '',
      gender: ''
    })
    setCourses([{ id: Date.now(), courseId: '', duration: '', fees: '' }])
    setErrors({})
    setCurrentStep(1)
    setIsSubmitted(false)
  }

  // Calculate total fees
  const totalFees = courses.reduce((total, course) => {
    return total + (parseFloat(course.fees) || 0)
  }, 0)

  // Render email status message
  const renderEmailStatus = () => {
    if (!studentDetails.email || !studentDetails.email.includes('@')) return null
    
    switch (emailStatus) {
      case 'checking':
        return <span className="email-status email-checking">Checking email availability...</span>
      case 'available':
        return <span className="email-status email-available">✓ Email is available</span>
      case 'taken':
        return <span className="email-status email-taken">✗ This email is already registered</span>
      default:
        return null
    }
  }

  return (
    <div className="enrollment-form">
      {/* Progress Indicator */}
      <div className="progress-indicator">
        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Student Details</div>
        </div>
        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Course Selection</div>
        </div>
        <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Review & Confirm</div>
        </div>
      </div>

      {!isSubmitted ? (
        <form onSubmit={(e) => e.preventDefault()} className="form-section">
          {/* Step 1: Student Details */}
          {currentStep === 1 && (
            <div className="step-content">
              <h2 className="section-title">Student Information</h2>
              
              <div className="form-group">
                <label htmlFor="name" className="required">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={studentDetails.name}
                  onChange={handleStudentDetailsChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="Enter your full name"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="required">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={studentDetails.email}
                  onChange={handleStudentDetailsChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="your.email@example.com"
                />
                {renderEmailStatus()}
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="country" className="required">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={studentDetails.country}
                    onChange={handleStudentDetailsChange}
                    className={errors.country ? 'error' : ''}
                  >
                    <option value="">Select your country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="IN">India</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="JP">Japan</option>
                  </select>
                  {errors.country && <span className="error-text">{errors.country}</span>}
                </div>

                <div className="form-group">
                  <label className="required">Gender</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={studentDetails.gender === 'Male'}
                        onChange={handleStudentDetailsChange}
                      />
                      Male
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={studentDetails.gender === 'Female'}
                        onChange={handleStudentDetailsChange}
                      />
                      Female
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value="Other"
                        checked={studentDetails.gender === 'Other'}
                        onChange={handleStudentDetailsChange}
                      />
                      Other
                    </label>
                  </div>
                  {errors.gender && <span className="error-text">{errors.gender}</span>}
                </div>
              </div>

              <div className="navigation-buttons">
                <div></div> {/* Empty div for spacing */}
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={nextStep}
                  disabled={emailStatus === 'checking' || emailStatus === 'taken'}
                >
                  Next: Course Selection →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Course Selection */}
          {currentStep === 2 && (
            <div className="step-content">
              <h2 className="section-title">Select Your Courses</h2>
              
              <div className="courses-section">
                <div className="course-header">
                  <h3>Selected Courses</h3>
                  <div className="course-actions">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={addCourse}
                    >
                      + Add Another Course
                    </button>
                  </div>
                </div>

                {courses.map((course, index) => (
                  <div key={course.id} className="course-item">
                    <div className="course-item-header">
                      <div className="course-item-number">Course {index + 1}</div>
                      {courses.length > 1 && (
                        <button
                          type="button"
                          className="remove-course"
                          onClick={() => removeCourse(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="course-fields">
                      <div className="form-group">
                        <label className="required">Course Name</label>
                        <select
                          value={course.courseId}
                          onChange={(e) => handleCourseChange(index, 'courseId', e.target.value)}
                          className={errors.courses?.[index] ? 'error' : ''}
                        >
                          <option value="">Select a course</option>
                          {COURSES_DATA.map(courseOption => (
                            <option key={courseOption.id} value={courseOption.id}>
                              {courseOption.name}
                            </option>
                          ))}
                        </select>
                        {errors.courses?.[index] && (
                          <span className="error-text">{errors.courses[index]}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Duration</label>
                        <input
                          type="text"
                          value={course.duration}
                          readOnly
                          placeholder="Auto-filled"
                        />
                      </div>

                      <div className="form-group">
                        <label>Fees ($)</label>
                        <input
                          type="text"
                          value={course.fees ? `$${course.fees}` : ''}
                          readOnly
                          placeholder="Auto-filled"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="navigation-buttons">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={prevStep}
                >
                  ← Back to Student Details
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={nextStep}
                >
                  Next: Review & Confirm →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Confirm */}
          {currentStep === 3 && (
            <div className="step-content">
              <h2 className="section-title">Review Your Enrollment</h2>
              
              <div className="review-section">
                <div className="review-item">
                  <div className="review-label">Personal Information</div>
                  <div className="review-value">
                    <strong>Name:</strong> {studentDetails.name}<br />
                    <strong>Email:</strong> {studentDetails.email}<br />
                    <strong>Country:</strong> {studentDetails.country}<br />
                    <strong>Gender:</strong> {studentDetails.gender}
                  </div>
                </div>

                <div className="review-item">
                  <div className="review-label">Selected Courses</div>
                  <div className="courses-review">
                    {courses.map((course, index) => {
                      const courseData = COURSES_DATA.find(c => c.id === parseInt(course.courseId))
                      return courseData ? (
                        <div key={index} className="course-review-item">
                          <div className="course-review-name">{courseData.name}</div>
                          <div className="course-review-details">
                            Duration: {courseData.duration} • Fees: ${courseData.fees}
                          </div>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>

                <div className="total-fees">
                  Total Enrollment Fees: ${totalFees}
                </div>
              </div>

              <div className="navigation-buttons">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={prevStep}
                >
                  ← Back to Course Selection
                </button>
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner"></span>
                      Processing Enrollment...
                    </>
                  ) : (
                    'Confirm Enrollment'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      ) : (
        /* Success Message */
        <div className="success-message">
          <div className="success-icon">🎉</div>
          <h2>Enrollment Successful!</h2>
          <p>
            Thank you for enrolling in our courses. We've sent a confirmation email to {studentDetails.email}. 
            You'll receive further instructions shortly.
          </p>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={resetForm}
          >
            Enroll Another Student
          </button>
        </div>
      )}
    </div>
  )
}

export default CourseEnrollmentForm