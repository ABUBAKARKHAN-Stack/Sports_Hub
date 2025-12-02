import { Button } from '@/components/ui/button'
import React from 'react'

const HomePage = () => {
  return (
    <div>
      Hello From SportsHub
      <Button variant={"default"}>
        Hey
      </Button>
       <Button variant={"secondary"}>
        Hey
      </Button>
       <Button variant={"outline"}>
        Hey
      </Button>
       <div className='bg-base-gradient ' >
        Hey
      </div>
       <Button variant={"link"}>
        Hey
      </Button>
    </div>
  )
}

export default HomePage