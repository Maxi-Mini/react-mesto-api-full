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
  const [userData, setUserData] = useState({});
  const [isDataSet, setIsDataSet] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (loggedIn) {
      api
        .getAllInfo()
        .then((res) => {
          const [cardsData, usersData] = res;
          setCards(cardsData);
          setCurrentUser(usersData);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      auth
        .getContent(token)
        .then((data) => {
          if (data) {
            setUserData({ email: data.email });
            setLoggedIn(true);
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [history, loggedIn]);

  const handleLogin = (email, password) => {
    auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          console.log(data);
          localStorage.setItem("token", data.token);
          setUserData({ email });
          setLoggedIn(true);
          history.push("/");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleRegister = (email, password) => {
    auth
      .register(email, password)
      .then(() => {
        setIsDataSet(true);
        history.push("/sign-in");
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData({ email: "" });
    setLoggedIn(false);
    history.push("/sign-in");
  };

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((res) => {
        setCards((cards) => cards.map((c) => (c._id === card._id ? res : c)));
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
      .setUserInfo(user)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateAvatar = (avatar) => {
    api
      .setUserAvatar(avatar)
      .then((res) => {
        setCurrentUser(res);
        setIsDataSet(true);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsDataSet(false);
      });
  };

  const handleAddPlaceSubmit = (card) => {
    api
      .postCard(card)
      .then((res) => {
        setIsDataSet(true);
        setCards([res, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsDataSet(false);
      });
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
