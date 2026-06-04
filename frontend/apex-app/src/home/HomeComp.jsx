import React from 'react'
import { useNavigate } from 'react-router-dom'

const HomeComp = () => {
    const navigate = useNavigate()
  return (
    <div className="home-comp">
        <div className="home-comp-header">
            <div className="login-button">
                 <button onClick={() => navigate('/login')}>Login</button>
            </div>
            <div className="social-icons">
                {/* Social media icons would go here */}
                <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/facebook.png"
                        alt="Facebook"
                    />
                </a>

                <a
                    href="https://www.messenger.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/messanger.png"
                        alt="Messenger"
                    />
                </a>

                <a
                    href="https://twitter.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/twitter.png"
                        alt="Twitter"
                    />
                </a>

                <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/instagram.png"
                        alt="Instagram"
                    />
                </a>

                <a
                    href="https://web.whatsapp.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/whatsapp.png"
                        alt="WhatsApp"
                    />
                </a>

                <a
                    href="https://telegram.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/telegram.png"
                        alt="Telegram"
                    />
                    </a>

                    <a
                    href="https://www.youtube.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    <img
                        src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/youtube.png"
                        alt="YouTube"
                    />
                    </a>

                    <a
                    href="https://www.linkedin.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    <img
                        src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/linkedln.png"
                        alt="LinkedIn"
                    />
                    </a>

                    {/* Duplicate icons for smooth infinite slide */}

                    <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    <img
                        src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/facebook.png"
                        alt="Facebook"
                    />
                    </a>

                    <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    <img
                        src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/instagram.png"
                        alt="Instagram"
                    />
                    </a>

                    <a
                    href="https://www.linkedin.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    <img
                        src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/linkedln.png"
                        alt="LinkedIn"
                    />
                    </a>
            </div>
        </div>
    </div>
  )
}

export default HomeComp;