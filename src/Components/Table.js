import React, { useState, useEffect } from 'react'; // React kütüphanesinden useState ve useEffect hook'ları dahil ediliyor
import axios from 'axios'; // API istekleri için axios kütüphanesi dahil ediliyor
import './Table.css'; // CSS dosyası dahil ediliyor


const Table = () => {
  const [data, setData] = useState([]); // Veri durumu, başlangıçta boş bir dizi
  const [filteredData, setFilteredData] = useState([]); // Filtrelenmiş veri durumu, başlangıçta boş bir dizi
  const [loading, setLoading] = useState(true); // Yükleniyor durumu, başlangıçta true
  const [error, setError] = useState(null); // Hata durumu, başlangıçta null
  const [searchTerm, setSearchTerm] = useState(''); // Arama terimi, başlangıçta boş
  const [currentPage, setCurrentPage] = useState(1); // Geçerli sayfa, başlangıçta 1
  const [charactersPerPage] = useState(250); // Sayfada gösterilecek karakter sayısı, sabit olarak 250
  const [selectedCharacterId, setSelectedCharacterId] = useState(null); // Seçilen karakterin ID'si, başlangıçta null
  const [filters, setFilters] = useState({ gender: '', status: '', species: '' }); // Filtreleme için başlangıçta boş değerler
  const [totalPages, setTotalPages] = useState(1); // Toplam sayfa sayısı, başlangıçta 1

  useEffect(() => {
    const fetchData = async () => { // Veri çekmek için asenkron fonksiyon
      try {
        setLoading(true); // Yükleniyor durumunu true yap
        let allData = []; // Tüm veriyi saklayacak dizi
        let page = 1; // Sayfa sayacı başlangıçta 1

        while (page <= 42) { // 42 sayfaya kadar veri çek
          const response = await axios.get(`https://rickandmortyapi.com/api/character?page=${page}`); // API'den karakter verisi çek
          allData = [...allData, ...response.data.results]; // Çekilen veriyi mevcut verilere ekle
          page += 1; // Sayfayı bir artır
        }

        setData(allData); // Tüm veriyi data state'ine aktar
        setTotalPages(Math.ceil(allData.length / charactersPerPage)); // Toplam sayfa sayısını hesapla
      } catch (err) {
        console.error('Veri çekme hatası:', err); // Hata durumunda konsola hata mesajı yaz
        setError('Veri çekme hatası'); // Hata mesajını state'e set et
      } finally {
        setLoading(false); // İşlem tamamlandığında yükleniyor durumunu false yap
      }
    };

    fetchData(); // Veriyi çekmek için fetchData fonksiyonunu çağır
  }, []); // Boş bağımlılık dizisi ile sadece bileşen ilk render edildiğinde çalışacak

  // Arama ve filtreleme işlemlerini birleştirir
  useEffect(() => {
    let filtered = data; // Başlangıçta filtrelenmiş veriyi tüm veriler olarak al

    // Arama işlemi
    if (searchTerm) {
      filtered = filtered.filter((character) => // Karakter adı arama terimiyle eşleşiyorsa filtrele
        character.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtreleme işlemi
    if (filters.gender) {
      filtered = filtered.filter((character) => character.gender === filters.gender); // Cinsiyet filtresi uygula
    }
    if (filters.status) {
      filtered = filtered.filter((character) => character.status === filters.status); // Durum filtresi uygula
    }
    if (filters.species) {
      filtered = filtered.filter((character) => character.species === filters.species); // Tür filtresi uygula
    }

    setFilteredData(filtered); // Filtrelenmiş veriyi state'e aktar
  }, [searchTerm, filters, data]); // Arama terimi, filtreler ve veri değiştiğinde çalışacak

  const handleSearchChange = (e) => { // Arama kutusundaki değişiklikleri yakalar
    setSearchTerm(e.target.value); // Arama terimini günceller
  };

  const handleCharacterClick = (characterId) => { // Karakter tıklandığında çalışacak fonksiyon
    setSelectedCharacterId(selectedCharacterId === characterId ? null : characterId); // Aynı karakter tıklanırsa seçimi kaldır, yoksa seç
  };

  const handleFilterChange = (filterType, value) => { // Filtre değişikliklerini yönetir
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: prevFilters[filterType] === value ? '' : value, // Filtreyi değiştirecek veya temizleyecek
    }));
  };

  const isSelected = (filterType, value) => filters[filterType] === value; // Seçili filtreyi kontrol eder

  const handlePageChange = (pageNumber) => { // Sayfa değişikliği işlemi
    setCurrentPage(pageNumber); // Geçerli sayfayı güncelle
    setSelectedCharacterId(null); // Karakter detaylarını sıfırla
  };

  if (loading) return <p>Yükleniyor...</p>; // Yükleniyorsa mesaj göster
  if (error) return <p>{error}</p>; // Hata varsa mesaj göster

  // Sayfalama işlemleri
  const indexOfLastCharacter = currentPage * charactersPerPage; // Son karakterin indexini hesapla
  const indexOfFirstCharacter = indexOfLastCharacter - charactersPerPage; // İlk karakterin indexini hesapla
  const currentCharacters = filteredData.slice(indexOfFirstCharacter, indexOfLastCharacter); // Geçerli sayfaya ait karakterleri al

  return (
    <div> 
      <div className="filters">
        <div>
          <label><b>Gender: </b></label>
          <button
            className={isSelected('gender', 'Male') ? 'selected' : ''} // Seçili ise 'selected' sınıfını ekle
            onClick={() => handleFilterChange('gender', 'Male')}  // Male filtresi için değişiklik yap
          >
            Male
          </button>
          <button
            className={isSelected('gender', 'Female') ? 'selected' : ''}  // Seçili ise 'selected' sınıfını ekle
            onClick={() => handleFilterChange('gender', 'Female')}    // Female filtresi için değişiklik yap
          >
            Female
          </button>
          <button
            className={isSelected('gender', 'unknown') ? 'selected' : ''} // Seçili ise 'selected' sınıfını ekle
            onClick={() => handleFilterChange('gender', 'unknown')}   // Unknown filtresi için değişiklik yap
          >
            Unknown
          </button>
          <button
            className={isSelected('gender', 'Genderless') ? 'selected' : ''}  // Seçili ise 'selected' sınıfını ekle
            onClick={() => handleFilterChange('gender', 'Genderless')}  // Genderless filtresi için değişiklik yap
          >
            Genderless
          </button>
        </div>
        <div>
          <label><b>Status: </b></label>
          <button
            className={isSelected('status', 'Alive') ? 'selected' : ''}   // Seçili ise 'selected' sınıfını ekle
            onClick={() => handleFilterChange('status', 'Alive')}   // Alive filtresi için değişiklik yap
          >
            Alive
          </button>
          <button
            className={isSelected('status', 'Dead') ? 'selected' : ''}  // Seçili ise 'selected' sınıfını ekle
            onClick={() => handleFilterChange('status', 'Dead')}      // Dead filtresi için değişiklik yap
          > 
            Dead
          </button>
          <button
            className={isSelected('status', 'unknown') ? 'selected' : ''}   // Seçili ise 'selected' sınıfını ekle
            onClick={() => handleFilterChange('status', 'unknown')}   // Unknown filtresi için değişiklik yap
          >
            Unknown
          </button>
        </div>
        <div>
          <label><b>Species: </b></label>
          <button
            className={isSelected('species', 'Human') ? 'selected' : ''}  // Seçili ise 'selected' sınıfını ekle
            onClick={() => handleFilterChange('species', 'Human')}    // Human filtresi için değişiklik yap
          >
            Human
          </button>
          <button
            className={isSelected('species', 'Alien') ? 'selected' : ''}  // Seçili ise 'selected' sınıfını ekle  
            onClick={() => handleFilterChange('species', 'Alien')}    // Alien filtresi için değişiklik yap
          >
            Alien
          </button>
          <button
            className={isSelected('species', 'Humanoid') ? 'selected' : ''}   // Seçili ise 'selected' sınıfını ekle 
            onClick={() => handleFilterChange('species', 'Humanoid')}     // Humanoid filtresi için değişiklik yap
          > 
            Humanoid
          </button>
          <button
            className={isSelected('species', 'unknown') ? 'selected' : ''}    // Seçili ise 'selected' sınıfını ekle 
            onClick={() => handleFilterChange('species', 'unknown')}    // Unknown filtresi için değişiklik yap
          >
            Unknown
          </button>
          <button
            className={isSelected('species', 'Poopybutthole') ? 'selected' : ''}  // Seçili ise 'selected' sınıfını ekle
            onClick={() => handleFilterChange('species', 'Poopybutthole')}      // Poopybutthole filtresi için değişiklik yap
          >
            Poopybutthole
          </button>
          <button
            className={isSelected('species', 'Mythological Creature') ? 'selected' : ''} // Seçili ise 'selected' sınıfını ekle
            onClick={() => handleFilterChange('species', 'Mythological Creature')}  // Mythological Creature filtresi için değişiklik yap
          >
            Mythological Creature
          </button>
          <button
            className={isSelected('species', 'Robot') ? 'selected' : ''}  // Seçili ise 'selected' sınıfını ekle
            onClick={() => handleFilterChange('species', 'Robot')}    // Robot filtresi için değişiklik yap
          >
            Robot
          </button>
          <button
            className={isSelected('species', 'Animal') ? 'selected' : ''} // Seçili ise 'selected' sınıfını ekle
            onClick={() => handleFilterChange('species', 'Animal')}   // Animal filtresi için değişiklik yap
          >
            Animal
          </button>
          <button
            className={isSelected('species', 'Disease') ? 'selected' : ''}  // Seçili ise 'selected' sınıfını ekle
            onClick={() => handleFilterChange('species', 'Disease')}    // Disease filtresi için değişiklik yap
          >
            Disease
          </button>
          <button
            className={isSelected('species', 'Cronenberg') ? 'selected' : ''} // Seçili ise 'selected' sınıfını ekle
            onClick={() => handleFilterChange('species', 'Cronenberg')}   // Cronenberg filtresi için değişiklik yap
          >
            Cronenberg
          </button>
        </div>
      </div>

      <input
        type="text"
        className="search-bar"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearchChange} // Arama kutusunda değişiklik olursa handleSearchChange çalışacak
      />

      {/* Veri yoksa mesajı göster */}
      {filteredData.length === 0 && !loading && !error && (
        <p><b> NO RESULTS FOUND FOR THE SELECTED FILTERS !!!</b></p>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Species</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {currentCharacters.map((character) => (  // Şu anki karakterleri döngüyle göster
              <React.Fragment key={character.id}>
                <tr>
                  <td>{character.id+'-) '}{character.name}</td>
                  <td>{character.gender}</td>
                  <td>{character.status}</td>
                  <td>{character.species}</td>
                  <td>
                    <button onClick={() => handleCharacterClick(character.id)}>
                      {selectedCharacterId === character.id ? '-' : '+'}  {/* Detaylar görünürse '-' göster */}
                    </button>
                  </td>
                </tr>
                {selectedCharacterId === character.id && ( // Eğer bu karakter seçildiyse detayları göster
                  <tr className="details-row">
                    <td colSpan="4">
                      <div className="details-bar">
                        <h3>{character.name}</h3>
                        <img src={character.image} alt={character.name} />
                        <p>Status: <b>{character.status}</b></p>
                        <p>Species: <b>{character.species}</b></p>
                        <p>Gender: <b>{character.gender}</b></p>
                        <p>Origin: <b>{character.origin.name}</b></p>
                        <p>Location: <b>{character.location.name}</b></p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {[...Array(totalPages).keys()].map((num) => ( // Sayfa numaralarını döngüyle oluştur
          <button
            key={num + 1}
            onClick={() => handlePageChange(num + 1)}  // Sayfa numarasına tıklandığında sayfa değiştir
            className={currentPage === num + 1 ? 'active' : ''}  // Aktif sayfayı 'active' sınıfıyla işaretle
          >
            {num + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Table;
