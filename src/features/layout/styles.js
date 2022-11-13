import tw, { css, styled } from 'twin.macro'

export const baseStyles = css`
  body {
    ${tw`max-w-6xl min-h-screen mx-auto bg-primary font-sans text-xl text-primary`};
  }
`

export const StyledNav = styled.nav`
  ${tw`grid grid-template-columns[1fr repeat(3, minmax(min-content, max-content))] gap-x-2 text-center place-items-center`};

  .logo {
    ${tw`flex items-center py-2 justify-self-start md:justify-center`};
    svg {
      ${tw`block w-10 h-12 md:(w-14 h-16)`};
    }
  }

  a {
    ${tw`flex items-center p-3 md:(ml-0 px-10 text-xl) hover:text-highlight`};
  }
`

export const StyledHeader = tw.header`grid grid-template-columns[1fr minmax(min-content, max-content)] gap-x-2 md:gap-x-4`

export const StyledFooter = styled.footer`
  ${tw`grid py-6 text-sm font-light border-t-2 mt-10 place-items-center gap-y-2`};
`
