import { Slot } from 'radix-ui';
import type { ComponentProps } from 'react';
type ButtonProps = ComponentProps<'button'> & { asChild?: boolean };
export function Button({asChild=false,className='',type='button',...props}:ButtonProps){
 const Component=asChild?Slot.Root:'button';
 return <Component className={'button '+className} {...(!asChild?{type}:{})} {...props}/>;
}
