import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

type Props = {
    title: string
    children: React.ReactElement<any, any>
    placement: any
    width:number
}

const BootstrapTooltip = styled(({ className, placement,width, ...props }: TooltipProps & {width:number}) => (
    <Tooltip {...props} arrow classes={{ popper: className }} placement={placement}/>
))(({ theme,width }) => ({
    [`& .${tooltipClasses.arrow}`]: { 
        color: theme.palette.common.white,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        maxWidth: `${width}`,
        color: '#6D747A',
        margin: '10px !important',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '11px',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '18px',
        letterSpacing: '0.14px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
        transform: 'none !important',
        // textAlign: 'justify',
        padding: "8px 10px 8px 10px",
        gap: "10px",
        borderRadius: "8px",
        opacity: "0px",
    },
}))

const CustomizedTooltips2: React.FC<Props> = ({ title, children, placement, width}) => {
    const [clicked, setClicked] = useState(false)
    return (
        <>
            <BootstrapTooltip
                onMouseLeave={() => {
                    if (clicked) {
                        setClicked(false)
                    }
                }}
                title={clicked ? '' : title}
                placement={placement}
                width={width}

            >
                {React.cloneElement(children, {
                    onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
                        if (children.props.onClick) {
                            children.props.onClick(event)
                        }
                        setClicked(true)
                    },
                })}
            </BootstrapTooltip>
        </>
    )
}

export default CustomizedTooltips2
