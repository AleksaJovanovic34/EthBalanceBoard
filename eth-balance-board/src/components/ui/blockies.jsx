import { useEffect, useRef, React } from 'react'
import blockies from 'ethereum-blockies'

const Blockie = ({ address }) => {
    const ref = useRef();

    useEffect(() => {
        if (address && ref.current) {
            const icon = blockies.create({ seed: address.toLowerCase(), size:8, scale:3});
            ref.current.innerHTML = '';
            ref.current.appendChild(icon);
        }
    }, [address])
    return <div ref={ref} className="w-[24px] h-[24px] overflow-hidden"></div>
}

export default Blockie;
