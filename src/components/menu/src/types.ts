type NavMenuDiffrence = XOR<[{ title: string }, { children: NavMenuDataSource[] }]>

type NavMenuNormalConfig = NavMenuDiffrence & {
  type?: 'nav'
  disabled?: boolean
}

interface NavMenuSeparator {
  type: 'sep'
}

export type NavMenuDataSource = NavMenuNormalConfig | NavMenuSeparator

export interface NavMenuProps {
  title: string
  options?: NavMenuDataSource[]
}
