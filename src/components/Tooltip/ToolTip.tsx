import React from 'react'
import { styled } from '@mui/material/styles'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

type Props = {
  title: string
  children: React.ReactElement<any, any>
}

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: '#8064A2',
    margin: '4px 0 0 0 !important',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '24px',
    letterSpacing: '0.14px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
    transform: 'none !important',
  },
}))

const CustomizedTooltips: React.FC<Props> = ({ title, children }) => {
  return <BootstrapTooltip title={title}>{children}</BootstrapTooltip>
}

export default CustomizedTooltips
