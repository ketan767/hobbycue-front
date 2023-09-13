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
    font: 'Poppins',
  },
}))

const CustomizedTooltips: React.FC<Props> = ({ title, children }) => {
  return (
    <BootstrapTooltip title={title}>
      <Typography className="text-color">{children}</Typography>
    </BootstrapTooltip>
  )
}

export default CustomizedTooltips
