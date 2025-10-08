import CourseEnrollmentForm from './components/CourseEnrollmentForm'
import './index.css'

function App() {
  return (
    <div className="container">
      <div className="header">
        <h1>Online Course Enrollment</h1>
        <p>Expand your knowledge and skills with our comprehensive course catalog</p>
      </div>
      <CourseEnrollmentForm />
    </div>
  )
}

export default App