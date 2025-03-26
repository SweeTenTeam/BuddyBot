import React from "react";
import Switch from './Switch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faConfluence, faGithub, faJira } from '@fortawesome/free-brands-svg-icons';



export default function Navbar() {
    return (
        <nav className='flex w-full justify-between items-center p-4 rounded-2xl border-none bg-chart-1'>
            <ul className='flex justify-between items-center list-none'>
                <li id='git' className=" pl-4 pr-4 pt-0 pb-0 cursor-pointer flex relatice flex-col h-full group">
                    <a className='inline-flex items-start relative no-underline  transition-all group-hover:scale-125' href="https://docs.github.com/en"
                    data-testid="github-icon">
                        <FontAwesomeIcon icon={faGithub} size='lg' className='text-white' />
                        <p className='hidden'>GitHub</p>

                    </a>
                </li>
                <li id='jira' className="pl-4 pr-4 pt-0 pb-0 cursor-pointer flex relatice flex-col h-full group">
                    <a className='inline-flex items-start relative no-underline  transition-all group-hover:scale-125' href="https://confluence.atlassian.com/jira"
                    data-testid="jira-icon">
                        <FontAwesomeIcon icon={faJira} size='lg' className='text-white' />
                        <p className='hidden'>Jira</p>

                    </a>
                </li>
                <li id='confl' className="pl-4 pr-4 pt-0 pb-0 cursor-pointer flex relatice flex-col h-full group">
                    <a className='inline-flex items-start relative no-underline transition-all group-hover:scale-125' href="https://support.atlassian.com/confluence-cloud/resources/"
                    data-testid="confluence-icon">
                        <FontAwesomeIcon icon={faConfluence} size='lg' className='text-white' />
                        <p className='hidden'>Confluence</p>

                    </a>
                </li >
                {/* <li id='azzurro' className="list-li">
                    <a className='inline-flex items-start relative no-underline ' href="https://azzurrodigitale.com">
                        <img className='azzurro' src='/azzurro.png' alt='Azzurro Digitale' />
                    </a>
                </li> */}
            </ul >

            <div id='theme-switcher' data-testid="theme-switcher">
                <Switch />
            </div>
        </nav >
    )
}
