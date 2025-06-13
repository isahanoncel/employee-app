import { LitElement, html, css } from 'lit';

export class NavBar extends LitElement {
  static styles = css`
    nav {
      background-color: var(--color-primary);
      padding: 1rem;
      color: var(--color-white);
      display: flex;
      justify-content: space-between;
    }

    a {
      color: var(--color-white);
      text-decoration: none;
      margin-left: 1rem;
    }

    a:hover {
      text-decoration: underline;
    }
  `;

  render() {
    return html`
      <nav>
        <div>Employee App</div>
        <div>
          <a href="/">List</a>
          <a href="/new">Add New</a>
        </div>
      </nav>
    `;
  }
}

customElements.define('nav-bar', NavBar);
