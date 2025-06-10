import React from 'react';
import Content from '@theme-original/Navbar/Content';
import type ContentType from '@theme/Navbar/Content';
import type {WrapperProps} from '@docusaurus/types';
import { TopBanners } from '@site/src/components/TopBanners';

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): JSX.Element {
  return (
    <>




<div className='flex flex-col w-full'>

     

    <div>
      
      <Content {...props} />

    </div>

    <div className=' min-[996px]:hidden mt-3'>
      <TopBanners bannerClassName={'h-10'} label={false} mobile={false} />
    </div>

   
</div>

    </>
  );
}
