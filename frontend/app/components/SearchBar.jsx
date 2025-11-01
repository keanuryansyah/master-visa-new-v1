import "../styles/search-bar.scss";

export default function SearchBar() {
    return (
                    <div className="search-bar">
              <input type="text" placeholder="Cari negara tujuan Anda" />
              <button>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>

    )
}