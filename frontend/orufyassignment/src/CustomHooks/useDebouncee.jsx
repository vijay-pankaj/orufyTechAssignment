import React, { useEffect, useState } from 'react'
const useDebouncee = (value,delay=2000) => {
    const [debounced,setdebounced]=useState('');
    useEffect(()=>{
        const t=setTimeout(()=>setdebounced(value),delay);
        return ()=>clearTimeout(t);
    },[value,delay])
    return debounced;
}
export default useDebouncee