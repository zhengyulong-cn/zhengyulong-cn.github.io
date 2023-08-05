interface ISideBarItem {
  id: string;
  title: string;
  link: string;
}

export type ISideBars = Array<ISideBarItem>;

export const sidebars: ISideBars = [
  {
    id: '001',
    title: 'Grid布局',
    link: '/gridlayout',
  },
  {
    id: '002',
    title: '正则表达式匹配',
    link: '/',
  },
]