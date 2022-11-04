interface NavMenuCommonConfig {
  key?: string | symbol
}

type NavMenuNormalConfig = NavMenuCommonConfig & XOR<[{ title: string }, { children: NavMenuDataSource[] }]> & {
  type?: 'nav'
  disabled?: boolean
}

interface NavMenuSeparator extends NavMenuCommonConfig {
  type: 'sep'
}

export type NavMenuDataSource = NavMenuNormalConfig | NavMenuSeparator

export interface NavMenuProps {
  title: string
  options?: NavMenuDataSource[]
}
