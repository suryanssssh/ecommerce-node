import React from 'react'
import Footer from './Footer';
import Header from './Header'
const Layout=({children})=>{
return(
    <div>
    <Header/>
      <body style={{minHeight:'80vh'}}>  
        {children}
      </body>
    <Footer/>
    </div>
)
}

export default Layout;