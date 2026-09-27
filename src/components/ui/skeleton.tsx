import type { ComponentProps } from 'react';
export function Skeleton({className='',...props}:ComponentProps<'div'>){return <div {...props} aria-hidden="true" className={'skeleton '+className}/>;}
