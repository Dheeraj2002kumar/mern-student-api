import { useEffect, useState } from "react";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from './services/studentService.js'

function App() {
  const [students, setStudents] = useState([])
  const [form, setForm] = useState({
    name: '',
    email: '',
    course: '',
  })
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getStudents()

      // assumes backend returns an array
      setStudents(response.data)
    } catch (err) {
      setError('Unable to fetch students. Check your backend.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  // add or update student
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editId){
        await updateStudent(editId, form)
      } else {
        await addStudent(form)
      }

      setForm({ name: '', email: '', course: '' })
      setEditId(null)

      fetchStudents()
    } catch (err){
      setError('Unable to save student.')
      console.error(err)
    }
  }

  // edit student
  const handleEdit = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      course: student.course,
    })

    setEditId(student._id)
  }
  
  // Delete student
  const handleDelete = async(id) => {
    if(!window.confirm('Are you sure you want to delete?')) return

    try {
      await deleteStudent(id)
      fetchStudents()
    } catch (error) {
      setError('Unable to delete student.')
      console.error(error)
    }
  }

  const inputClass = 'w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:fing-blue-500'

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl max-auto">

        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Student Management System
        </h1>

        {/* student form */}
        <div className="bg-white p-6 rounded-xl shadow-mb mb-8">
          <h2 className="text-xl font-semibold mb-5">
            {editId ? 'Update Student' : 'Add New Student'}
          </h2>

          <form onSubmit={handleSubmit}>
            <input 
            type="text"
            name="name"
            placeholder="Enter student name"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
            required
            />

            <input 
            type="text"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            required
            />

            <input 
            type="text"
            name="course"
            placeholder="Enter course"
            value={form.course}
            onChange={handleChange}
            className={inputClass}
            required
            />

            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg">
              {editId ? 'Update Student' : 'Add Student'}
            </button>

            {editId && (
              <button 
                type="button"
                onClick={() => {
                  setEditId(null)
                  setForm({ name: '', email: '', course: '' })
                }}
                className="ml-3 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
              >Cancel</button>
            )}
          </form>
        </div>

        {/* student List */}
        <div className="bg-whilte p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-5">
            All Student ({students.length})
          </h2>

          {error && (
            <p className="text-red-600 mb-4">{error}</p>
          )}

          {loading ? (
            <p>Loading Students...</p>
          ) : students.length === 0 ? (
            <p className="text-gray-500">No students found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Course</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">{student.name}</td>
                      <td className="p-3">{student.email}</td>
                      <td className="p-3">{student.course}</td>

                      <td className="p-3 whitespace-nowrap">
                        <button onClick={() => handleEdit(student)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 rounded mr-2">Edit</button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
