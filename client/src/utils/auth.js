import { jwtDecode } from 'jwt-decode';

class AuthService {

  getToken() {
    return localStorage.getItem('id_token');
  };

  login(idToken, familyId) {
    localStorage.setItem('id_token', idToken);

    const redirectPath = familyId ? `/join-family/${familyId}` : '/';

    window.location.assign(redirectPath);
  };

  istokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.istokenExpired(token);
  }
}

export default new AuthService();