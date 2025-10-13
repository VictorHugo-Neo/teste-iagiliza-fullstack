import { Heading } from '../Heading'; 
import { Button } from '../Button';   

export const Header = () => { // header component
  return (
    
    <header className="relative bg-dark p-10 flex items-center justify-between">
      <div className="absolute left-1/2 -translate-x-1/2">
        <Heading type="h1">
          <span className="text-primary text-3xl font-bold">
            LIZA ai
          </span>
        </Heading>
      </div>
      <div className="flex w-full justify-end">
        <Button>
          LOGIN
        </Button>
      </div>
    </header>
  );
};