import React, { useState, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabaseClient' // Ensure this is correctly set up
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const ShowCloseGraph = ({ results }) => {
  const { actual_prices, predicted_prices, future_prices, future_days } =
    results
  const [goalPrice, setGoalPrice] = useState('')
  const [savedGoalPrice, setSavedGoalPrice] = useState<number | null>(null)
  const notificationSent = useRef(false) // Prevent multiple notifications

  const futureLtp = future_prices.map((price) => price[3]) // 'Ltp' column is at index 3

  // Check if the goal price is met and send notification
  useEffect(() => {
    const checkAndNotify = async () => {
      if (
        savedGoalPrice &&
        !notificationSent.current &&
        futureLtp.some((price) => price >= savedGoalPrice)
      ) {
        toast.success(`Stock price has reached your goal of ${savedGoalPrice}!`)
        notificationSent.current = true // Prevent multiple alerts

        // Since we are not using authorization, we skip fetching user email
        // Instead, you can directly call sendEmailAlert with a predefined email or handle it differently
        const predefinedEmail = 'teamaquarius@gmail.com' // Replace with a valid email or logic to get it
        await sendEmailAlert(predefinedEmail, savedGoalPrice)
      }
    }

    checkAndNotify()
  }, [savedGoalPrice, futureLtp])

  // Function to send email alerts
  const sendEmailAlert = async (email: string, goalPrice: number) => {
    try {
      const response = await fetch('http://127.0.0.1:5050/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, goalPrice }),
      })

      if (response.ok) {
        toast.success('Email alert sent!')
      } else {
        const errorData = await response.json()
        console.error('Failed to send email alert:', errorData)
        toast.error('Failed to send email alert.')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error('An error occurred while sending the email.')
    }
  }

  // Save goal price to state only (do not save to Supabase)
  const saveGoalPrice = () => {
    if (!goalPrice) {
      toast.error('Please enter a valid goal price')
      return
    }

    // Set the goal price in state
    const parsedGoalPrice = parseFloat(goalPrice)
    if (isNaN(parsedGoalPrice)) {
      toast.error('Please enter a valid number for the goal price')
      return
    }

    setSavedGoalPrice(parsedGoalPrice)
    toast.success('Goal price set successfully!', {
      duration: 7000, // duration in milliseconds (5000ms = 5 seconds)
    })

    // Reset the goal price input
    setGoalPrice('')
  }

  return (
    <div>
      <section className='text-center space-y-4'>
        <Plot
          data={[
            {
              x: [...Array(actual_prices.length).keys()],
              y: actual_prices,
              type: 'scatter',
              mode: 'lines',
              name: 'Actual Prices',
            },
          ]}
          layout={{
            title: { text: 'Closing Price of Stock', font: { color: 'black' } },
            xaxis: { title: { text: 'Date', font: { color: 'black' } } },
            yaxis: { title: { text: 'Price', font: { color: 'black' } } },
          }}
        />
        <Card>
          <CardHeader>
            <CardTitle>Set Goal Price</CardTitle>
            <CardDescription>
              Get notified when the stock reaches your goal price.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex gap-2'>
            <Input
              type='number'
              placeholder='Enter goal price'
              value={goalPrice}
              onChange={(e) => setGoalPrice(e.target.value)}
            />
            <Button onClick={saveGoalPrice}>Set Goal</Button>
          </CardContent>
          <Separator />
          {savedGoalPrice && (
            <p className='text-green-500'>Your goal price: {savedGoalPrice}</p>
          )}
        </Card>
      </section>
    </div>
  )
}

export default ShowCloseGraph
