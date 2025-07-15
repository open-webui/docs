import React from "react";
import Layout from "@theme-original/Layout";
import { TopBanners } from "../components/TopBanners";

export default function CustomLayout(props) {
	return (
		<>
			{/* <div className=' z-[1000]' >
        <div className='w-full flex justify-center'>
            <div className=' px-2 py-1'>
                <TopBanners />
            </div>
        </div>
      </div> */}

			{/* Render the original layout (which includes the navbar and the rest) */}
			<Layout {...props} />
		</>
	);
}
