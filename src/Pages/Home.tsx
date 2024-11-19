import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import useUserStore from "../zustand/userStore";
import { useEffect } from "react";
// import { animated, useSpring } from "@react-spring/web";
// import { useDrag } from "@use-gesture/react";
import "./../assets/css/swap.css";
// Define your pages
// const pages = [
//   { id: 1, name: "News", content: "This is the News Page" },
//   { id: 2, name: "Market", content: "This is the Market Page" },
//   { id: 3, name: "Portfolio", content: "This is the Portfolio Page" },
// ];
const Home = () => {
  // const navigate = useNavigate();
  const vestr = JSON.parse(localStorage.getItem("vestr")!);
  const location = useLocation();
  const { setName, setEmail, setPhone, setUsername, setToken } = useUserStore();

  useEffect(() => {
    if (vestr) {
      setName(vestr.name);
      setEmail(vestr.email);
      setPhone(vestr.phoneNum);
      setUsername(vestr.username);
      setToken(vestr.token);
    }
  }, []);
  // const [currentPage, setCurrentPage] = useState(0); // Current page index
  // const [springStyles, api] = useSpring(() => ({ x: 0 })); // Animation for page transitions

  // // Handle gestures
  // const bind = useDrag(({ movement: [mx], direction: [dx], cancel, last }) => {
  //   const threshold = window.innerWidth / 3; // Swipe threshold

  //   // Check if swipe distance exceeds the threshold
  //   if (last) {
  //     if (Math.abs(mx) > threshold) {
  //       // Calculate next page based on swipe direction
  //       const nextPage = Math.min(
  //         Math.max(currentPage + (dx > 0 ? -1 : 1), 0),
  //         pages.length - 1
  //       );
  //       setCurrentPage(nextPage); // Update page index
  //       api.start({ x: -nextPage * window.innerWidth }); // Animate to new page
  //     } else {
  //       // Snap back to the current page
  //       api.start({ x: -currentPage * window.innerWidth });
  //     }
  //   } else {
  //     // Dragging animation
  //     api.start({ x: -currentPage * window.innerWidth + mx });
  //   }
  // });
  // useEffect(() => {
  //   if (currentPage == 0) {
  //     navigate("/news");
  //   }
  //   if (currentPage == 1) {
  //     navigate("/market");
  //   }
  //   if (currentPage == 2) {
  //     navigate("/portfolio");
  //   }
  // }, [currentPage]);
  return (
    <div className="headspace">
      {/* <div className="App">
        <animated.div
          className="page-container"
          {...bind()}
          style={{
            display: "flex",
            transform: springStyles.x.to((x) => `translate3d(${x}px, 0, 0)`),
          }}
        >
          {pages.map((page) => (
            <div className="page" key={page.id}>
              <h1>{page.name}</h1>
              <p>{page.content}</p>
              
            </div>
          ))}
        </animated.div>
      </div> */}
      <Outlet />
      {location.pathname != "/marketdetail" &&
        location.pathname != "/settings" &&
        location.pathname != "/addcash" &&
        location.pathname != "/addcashsuccess" && <Footer />}
      <SideBar />
    </div>
  );
};

export default Home;
