import SearchImage from '../assets/img/Search.png'
import CrownImage from '../assets/img/Crown.png'
import './Header_Bottom.css';

const Header_Bottom = () => {
    return (
        <div className='header_Bottom'>
            <div className='menu_Bottom'>
                <span style={{ position: 'relative', top: '-8px' }}>About</span>
                <span style={{ position: 'relative', top: '-8px' }}>Brand</span>
                <img style={{ width: '30px', height: '30px', marginLeft: '100px', marginRight: '100px'}} src={CrownImage} alt="crown" />
                <span style={{ position: 'relative', top: '-8px' }}>Store</span>
                <img style={{ width: '15px', height: '15px', marginRight: '-100px', marginLeft: '100px', marginBottom: '6px'}} src={SearchImage} alt="search" />
                <span style={{ position: 'relative', top: '-8px' }}>Search</span>
            </div>
        </div>
    );
}

export default Header_Bottom;