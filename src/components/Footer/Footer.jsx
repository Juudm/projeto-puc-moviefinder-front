import './Footer.css'
import { AiOutlineInstagram, AiOutlineFacebook, AiOutlineTwitter } from 'react-icons/Ai'


function Footer() {

  return (
      <div className='footer-home' >
        <div className='footer-redes-sociais'>
          <AiOutlineTwitter  />
          <AiOutlineInstagram />
          <AiOutlineFacebook />
        </div>
        <div className='footer-home-text'>
          <h1>MovieFinder</h1>
          <p>projeto feito com intuito meramente acadêmico</p>
        </div>
      </div>
  )
}

export default Footer
