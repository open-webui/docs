import React from "react";
import Layout from "@theme-original/Layout";

export default function CustomLayout(props) {
	return (
		<>
			{/* <div className=' z-[1000]' >
        <div className='w-full flex justify-center'>
            <div className=' px-2 py-1'>
                 
            </div>
        </div>
      </div> */}

			{/* Render the original layout (which includes the navbar and the rest) */}
			<Layout {...props} />
		</>
	);
}
