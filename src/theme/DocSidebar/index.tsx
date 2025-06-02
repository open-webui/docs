import React from 'react';
import DocSidebar from '@theme-original/DocSidebar';
import type DocSidebarType from '@theme/DocSidebar';
import type {WrapperProps} from '@docusaurus/types';


import { SidebarBanners } from "@site/src/components/SidebarBanners";



type Props = WrapperProps<typeof DocSidebarType>;

export default function DocSidebarWrapper(props: Props): JSX.Element {
  return (
    <>

      <div className=" overflow-auto h-full flex flex-col">
        <div className='h-fit'>
          <DocSidebar {...props} />
        </div>


        <div className=" px-5 mt-3">
          <SidebarBanners />
        </div>
      </div>
    </>
  );
}
