import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import "../index.css";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import { Login } from "./Login";
import { Register } from "./Register";
import { ProtectedRoute } from "./ProtectedRoute";
import { api } from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import * as auth from "../utils/auth";
import InfoToolTip from "./InfoTooltip";

function App() {
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
  });
  const [isDataSet, setIsDataSet] = useState(false);
  const [token, setToken] = useState("");

  const history = useHistory();

  useEffect(() => {
    loggedIn ? history.push("/") : history.push("/sign-in");
  }, [loggedIn, history]);

  const handleLogin = ( email, password ) => {
    auth
      .authorize(email, password)
      .then((res) => {
        if (res.token) {
          localStorage.setItem("token", res.token);
          setUserData({ email: email });
          setLoggedIn(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleRegister = ( email, password ) => {
    auth
      .register(email, password)
      .then((res) => {
        setIsDataSet(true);
        setTooltipStatus("success");
      })
      .catch((err) => {
        console.error(err);
        setIsDataSet(false);
        setTooltipStatus("");
        setIsInfoToolTipOpen(true);
      })
      .finally(() => {
        setIsDataSet(false);
        setIsInfoToolTipOpen(true);
      });
  };

  useEffect(() => {
    tokenCheck();
  }, []);

  const tokenCheck = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      auth
        .getContent(token)
        .then((res) => {
          if (res) {
            setCurrentUser(res.data);
            setUserData(res.data.email);
            setLoggedIn(true);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData({ email: "" });
    setLoggedIn(false);
  };

  useEffect(() => {
    if (loggedIn) {
      api
        .getAllInfo(token)
        .then((data) => {
          setCards(data.data.reverse());
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn, token]);

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((cards) =>
          cards.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  };

  const handleCardDelete = (card) => {
    api
      .deleteCard(card._id)
      .then((res) => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  };

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);
  const [tooltipStatus, setTooltipStatus] = useState("");

  const onEditProfile = () => {
    setIsEditProfilePopupOpen(true);
  };
  const onAddPlace = () => {
    setIsAddPlacePopupOpen(true);
  };
  const onEditAvatar = () => {
    setIsEditAvatarPopupOpen(true);
  };
  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({ title: "", link: "" });
    setIsInfoToolTipOpen(false);
  };

  const [selectedCard, setSelectedCard] = useState({ title: "", link: "" });
  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleUpdateUser = (user) => {
    api
      .setUserInfo(user, token)
      .then((data) => {
        setCurrentUser(data.data);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateAvatar = (avatar) => {
    api
      .setUserAvatar(avatar, token)
      .then((data) => {
        setCurrentUser(data.data);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };

  const handleAddPlaceSubmit = (card) => {
    api
      .postCard(card, token)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <Header
          loggedIn={loggedIn}
          handleLogout={handleLogout}
          email={userData.email}
        />

        <Switch>
          <ProtectedRoute
            exact
            path="/"
            loggedIn={loggedIn}
            handleEditProfileClick={onEditProfile}
            handleAddPlaceClick={onAddPlace}
            handleEditAvatarClick={onEditAvatar}
            handleCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            component={Main}
          />

          <Route path="/sign-up">
            <Register handleRegister={handleRegister} isDataSet={isDataSet} />
          </Route>

          <Route path="/sign-in">
            <Login handleLogin={handleLogin} />
          </Route>

          <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>

        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isDataSet={isDataSet}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isDataSet={isDataSet}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <InfoToolTip
          isOpen={isInfoToolTipOpen}
          onClose={closeAllPopups}
          authStatus={tooltipStatus}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
