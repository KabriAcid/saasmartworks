import type { ImgHTMLAttributes } from 'react';
/** Use only the official supplied asset; no fabricated mark. */
export function Logo({src,alt='SA’A SMART WORKS',...props}:Omit<ImgHTMLAttributes<HTMLImageElement>,'src'> & {src:string}){
// eslint-disable-next-line @next/next/no-img-element -- Shared primitive supports supplied assets across applications.
return <img src={src} alt={alt} {...props}/>;
}
