import React, { FC } from "react"
import styles from './styles.module.scss'
import { sidebars } from "@site/src/constants/sidebars";
import { useHistory } from '@docusaurus/router';

export const Layout: FC<React.PropsWithChildren> = ({children}) => {
  const history = useHistory();
  const onChangeSidebar = (id: string) => {
    const sidebarItem = sidebars.find(el => el.id === id);
    history.push(sidebarItem.link);
  }
  return (
    <div className={styles.layoutBox}>
      <div className={styles.leftBar}>
        { sidebars.map(sidebar => {
          return (
            <div
              className={styles.sidebarItem}
              key={sidebar.id}
              onClick={() => onChangeSidebar(sidebar.id)}
            >
              {sidebar.title}
            </div>
          )
        })}
      </div>
      <div className={styles.rightBody}>{children}</div>
    </div>
  )
};
