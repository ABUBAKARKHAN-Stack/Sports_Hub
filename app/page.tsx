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
       <Button variant={"ghost"}>
        Hey
      </Button>
       <Button variant={"link"}>
        Hey
      </Button>
    </div>
  )
}

export default HomePage