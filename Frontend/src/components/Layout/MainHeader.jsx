import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { styled } from 'styled-components'
import { Link } from 'react-router-dom'
import COLORS from '../../constants/colors'
import 로고 from '../../assets/로고.png'
import 이름 from '../../assets/이름.png'
import NAVPROFILE from '../../assets/NAVPROFILE.png'
import ProfileDropdown from '../HeaderPage/ProfileDropdown'
import ToggleBtn from '../HeaderPage/ToggleBtn'

function MainHeader() {
  const [navProfile, setNavProfile] = useState(NAVPROFILE)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLogined, setIsLogined] = useState(false)

  // Redux Store에서 isLogin 상태 가져오기
  const user = useSelector((state) => {
    return state.rootReducer.loginReducer.user
  })

  function checkUser() {
    if (user) {
      setIsLogined(true)
      setNavProfile(user.profileImageUrl)
    } else {
      setIsLogined(false)
    }
  }
  useEffect(() => {
    checkUser()
  }, [user])

  // Dropdown 메뉴 열기/닫기 함수
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState)
  }

  return (
    <Header>
      <Navbar className="container">
        <Logo>
          <Link to="/">
            <img className="fa-solid fa-bars" />
            <img className="logo" src={로고} alt="logo" />
            <img className="name" src={이름} alt="chaekbang" />
          </Link>
        </Logo>
        <Menu>
          <ul>
            <li>
              <Link to="/search">모임검색</Link>
            </li>
            <li>
              <Link to="/groups/create">모임만들기</Link>
            </li>
          </ul>
          <LoginOrMine>
            {isLogined ? (
              <>
                <img src={navProfile} onClick={toggleDropdown} />
                {isDropdownOpen && <ProfileDropdown />}
              </>
            ) : (
              // 로그인 상태가 아닐 때
              <button>
                <Link to="/login">로그인</Link>
              </button>
            )}
          </LoginOrMine>
        </Menu>
        <ToggleBtn></ToggleBtn>
      </Navbar>
    </Header>
  )
}

const Header = styled.div`
  width: 100%;
  height: 80px;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`
const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${COLORS.WHITE};
  padding: 8px 12px;
`
const Logo = styled.div`
  display: flex;

  a {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  img {
    height: auto;
  }

  img.logo {
    width: 70px;
  }
  img.name {
    width: 35px;
  }
`
const Menu = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  ul {
    display: flex;
  }

  li {
    display: inline-block;
    padding: 8px 12px;
    font-size: 20px;
    color: ${COLORS.THEME_COLOR4};
  }

  @media screen and (max-width: 700px) {
    display: none;
  }
`
const LoginOrMine = styled.div`
  padding: 0 12px;
  position: relative;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
  button {
    width: 92.5px;
    height: 40px;
    font-size: 20px;
    padding: 0 1rem 0 1rem;
    border-radius: 0.75rem;
    background-color: ${COLORS.THEME_COLOR2};
    color: ${COLORS.WHITE};
  }
  button:hover {
    opacity: 0.9;
  }
`

export default MainHeader
