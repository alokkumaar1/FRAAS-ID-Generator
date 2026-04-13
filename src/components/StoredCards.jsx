import "../styles/StoredCards.css"

const StoredCards = ({ cards, onLoadCard, onDeleteCard }) => {
  if (cards.length === 0) {
    return (
      <div className="no-cards">
        <p>No saved ID cards found.</p>
      </div>
    )
  }

  return (
    <div className="stored-cards">
      <h3>Saved ID Cards</h3>

      <div className="cards-list">
        {cards.map((card) => (
          <div key={card.id} className="card-item">
            <div className="card-info">
              <p className="card-name">{card.name}</p>
              <p className="card-details">
                {card.classDiv} • Roll: {card.rollNumber}
              </p>
              <p className="card-date">{new Date(card.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="card-actions">
              <button onClick={() => onLoadCard(card)} className="load-btn">
                Load
              </button>

              <button onClick={() => onDeleteCard(card.id)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StoredCards
