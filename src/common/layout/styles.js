import tw, { css, styled } from 'twin.macro'

export const baseStyles = css`
  body {
    ${tw`max-w-6xl min-h-screen mx-auto bg-primary font-mono text-xl text-primary`};
  }
`

export const StyledNav = styled.nav`
  ${tw`flex`}
  a {
    ${tw`flex items-center p-3 md:(ml-0 px-10 text-2xl) hover:text-highlight font-mono`};
  }
`

export const StyledHeader = tw.header`mt-2 flex justify-between items-center`

export const StyledFooter = styled.footer`
  ${tw`grid py-6 text-sm font-light border-t-2 mt-10 place-items-center gap-y-2`};
`
