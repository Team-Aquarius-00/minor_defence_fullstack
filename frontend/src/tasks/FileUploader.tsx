import React, { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const FileUploader = ({ setResults }) => {
  const [file, setFile] = useState(null)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      setResults(response.data)
      // console.log(setResults)
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  return (
    <div>
      <input type='file' accept='.csv' onChange={handleFileChange} />
      <div style={{ marginTop: '10px' }}>
        {/* <div className='mt-10'> */}
        <Button
          className='w-full flex items-center gap-6'
          onClick={handleUpload}
        >
          Load Data
        </Button>
      </div>
    </div>
  )
}

export default FileUploader
