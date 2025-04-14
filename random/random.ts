import React from "react";
import Switch from './Switch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faConfluence, faGithub, faJira } from '@fortawesome/free-brands-svg-icons';
import Image from "next/image";



export default function Navbar() {
    return (
        <nav className= 'flex w-full justify-between items-center p-4 rounded-2xl border-none bg-chart-1' >
        <ul className='flex justify-between items-center list-none' >
            <li id='git' className = " pl-4 pr-4 pt-0 pb-0 cursor-pointer flex relative flex-col h-full group" >
                <a className='inline-flex items-start relative no-underline  transition-all group-hover:scale-125' href = "https://docs.github.com/en"
    data - testid="github-icon" >
        <FontAwesomeIcon icon={ faGithub } size = 'lg' className = 'text-white' />
            <p className='hidden' > GitHub </p>

                </a>
                </li>
                < li id = 'jira' className = "pl-4 pr-4 pt-0 pb-0 cursor-pointer flex relative flex-col h-full group" >
                    <a className='inline-flex items-start relative no-underline  transition-all group-hover:scale-125' href = "https://confluence.atlassian.com/jira"
    data - testid="jira-icon" >
        <FontAwesomeIcon icon={ faJira } size = 'lg' className = 'text-white' />
            <p className='hidden' > Jira </p>

                </a>
                </>
                < li id = 'confl' className = "pl-4 pr-4 pt-0 pb-0 cursor-pointer flex relative flex-col h-full group" >
                    <a className='inline-flex items-start relative no-underline transition-all group-hover:scale-125' href = "https://support.atlassian.com/confluence-cloud/resources/"
    data - testid="confluence-icon" >
        <FontAwesomeIcon icon={ faConfluence } size = 'lg' className = 'text-white' />
            <p className='hidden' > Confluence </p>
                </a>
                </ >
                < li id = "azzurro" className = "pl-4 pr-4 pt-0 pb-0 cursor-pointer flex relative flex-col h-full group" >
                    <a className="inline-flex items-start relative no-underline transition-all group-hover:scale-125" href = "https://www.azzurrodigitale.com/" >
                        <Image width={ 40 } height = { 40} src = '/AD_logo_2_nero.svg' alt = 'azzurro' className = "items-center justify-center" />
                            </a>
                            </>
                            </ul >

                            < div id = 'theme-switcher' className = "flex items-center justify-between" data - testid="theme-switcher" >
                                <Switch />
                                </>
                                </nav >
    )
}
