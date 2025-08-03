import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Comic {
  id: number;
  title: string;
  series: string;
  issue: string;
  coverImage: string;
  description: string;
  genre: string;
  rating: number;
  price: number;
  releaseDate: string;
}

@Component({
  selector: 'app-comics',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './comics.html',
  styleUrl: './comics.scss'
})
export class Comics implements OnInit {
  comics: Comic[] = [];
  filteredComics: Comic[] = [];
  searchTerm = '';
  selectedGenre = '';
  selectedSeries = '';
  isLoading = false;

  genres = ['All', 'Superhero', 'Horror', 'Sci-Fi', 'Fantasy', 'Mystery', 'Action', 'Drama'];
  series = ['All', 'Dark Lobo', 'Shadow Hunters', 'Cyber Knights', 'Mystic Realms', 'Urban Legends'];

  ngOnInit(): void {
    this.loadComics();
  }

  loadComics(): void {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.comics = [
        {
          id: 1,
          title: 'The Awakening',
          series: 'Dark Lobo',
          issue: '#1',
          coverImage: 'https://via.placeholder.com/300x400/1a1a2e/ffffff?text=Dark+Lobo+1',
          description: 'In a world where darkness reigns, one hero emerges to challenge the shadows.',
          genre: 'Superhero',
          rating: 4.5,
          price: 3.99,
          releaseDate: '2024-01-15'
        },
        {
          id: 2,
          title: 'Shadow Hunters',
          series: 'Shadow Hunters',
          issue: '#1',
          coverImage: 'https://via.placeholder.com/300x400/16213e/ffffff?text=Shadow+Hunters+1',
          description: 'A team of elite hunters track down supernatural threats in the modern world.',
          genre: 'Horror',
          rating: 4.2,
          price: 2.99,
          releaseDate: '2024-02-01'
        },
        {
          id: 3,
          title: 'Cyber Knights',
          series: 'Cyber Knights',
          issue: '#1',
          coverImage: 'https://via.placeholder.com/300x400/0f3460/ffffff?text=Cyber+Knights+1',
          description: 'Futuristic warriors battle in a neon-lit cyberpunk world.',
          genre: 'Sci-Fi',
          rating: 4.7,
          price: 4.99,
          releaseDate: '2024-01-20'
        },
        {
          id: 4,
          title: 'Mystic Realms',
          series: 'Mystic Realms',
          issue: '#1',
          coverImage: 'https://via.placeholder.com/300x400/533483/ffffff?text=Mystic+Realms+1',
          description: 'Magical adventures in a world where fantasy meets reality.',
          genre: 'Fantasy',
          rating: 4.3,
          price: 3.49,
          releaseDate: '2024-02-10'
        },
        {
          id: 5,
          title: 'Urban Legends',
          series: 'Urban Legends',
          issue: '#1',
          coverImage: 'https://via.placeholder.com/300x400/2d3748/ffffff?text=Urban+Legends+1',
          description: 'Modern myths and legends come to life in the city streets.',
          genre: 'Mystery',
          rating: 4.1,
          price: 2.99,
          releaseDate: '2024-01-25'
        },
        {
          id: 6,
          title: 'The Last Stand',
          series: 'Dark Lobo',
          issue: '#2',
          coverImage: 'https://via.placeholder.com/300x400/1a1a2e/ffffff?text=Dark+Lobo+2',
          description: 'The battle intensifies as our hero faces his greatest challenge yet.',
          genre: 'Superhero',
          rating: 4.6,
          price: 3.99,
          releaseDate: '2024-02-15'
        }
      ];
      this.filteredComics = [...this.comics];
      this.isLoading = false;
    }, 1000);
  }

  filterComics(): void {
    this.filteredComics = this.comics.filter(comic => {
      const matchesSearch = comic.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           comic.series.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           comic.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesGenre = this.selectedGenre === 'All' || comic.genre === this.selectedGenre;
      const matchesSeries = this.selectedSeries === 'All' || comic.series === this.selectedSeries;
      
      return matchesSearch && matchesGenre && matchesSeries;
    });
  }

  onSearchChange(): void {
    this.filterComics();
  }

  onGenreChange(): void {
    this.filterComics();
  }

  onSeriesChange(): void {
    this.filterComics();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedGenre = 'All';
    this.selectedSeries = 'All';
    this.filterComics();
  }

  getStarRating(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('☆');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }
    return stars;
  }
} 