import type { ReactNode } from "react";

type HeadingProps = {
    children: ReactNode;
    type?: 'h1' | 'h2';
};

export const Heading = ({children, type = 'h1'}: HeadingProps) => {
    if(type === 'h1') {
        return <h1 className="">{children}</h1>
    }
    
    return <h2 className="">{children}</h2>
}