import SimpleLightbox from "simplelightbox";
import Notiflix from 'notiflix';
import { fetchImages, renderImageCard, onVisibilityChange } from './utils';
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    galleryActions: document.querySelector('.gallery-actions'),
    loader: document.querySelector('.loader'),
    loadMore: document.querySelector('.load-more')
}

let searchQuery = '';
let page = 1;
let cardHeight = 0;
const lightbox = new SimpleLightbox('.gallery a')

async function loadCards(event) {
    event.preventDefault()
    
    refs.gallery.classList.add('hidden')
    refs.galleryActions.classList.add('hidden')
    refs.loader.classList.remove('hidden')
    
    const formElements = event.currentTarget.elements;
    searchQuery = formElements.searchQuery.value;

    try {
        const imageData = await fetchImages(searchQuery)

        refs.loader.classList.add('hidden')
    
        if (imageData.totalHits === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        }
    
        if (imageData.totalHits > 0) {
            refs.gallery.classList.remove('hidden')
            
            refs.gallery.innerHTML = '';
    
            imageData.hits.forEach((image) => {
                refs.gallery.innerHTML = refs.gallery.innerHTML + renderImageCard(image);
    
                // console.log(image)
                // console.log(renderImageCard(image))
            })

            lightbox.refresh();
            cardHeight = refs.gallery.firstElementChild.getBoundingClientRect().height;
        }
    
        if (imageData.totalHits > 40) {
            refs.galleryActions.classList.remove('hidden')
        }
    } catch(err) {
        Notiflix.Notify.failure('Sorry, something went wrong. Please try to reload the page.');
        refs.loader.classList.add('hidden')
    }
}

async function loadMore() {
    refs.loader.classList.remove('hidden')
    refs.galleryActions.classList.add('hidden')

    try {
        const imageData = await fetchImages(searchQuery, page + 1)

        page = page + 1;
        
        refs.loader.classList.add('hidden')

        if (imageData.totalHits > 0) {
            imageData.hits.forEach((image) => {
                refs.gallery.innerHTML = refs.gallery.innerHTML + renderImageCard(image);
    
                // console.log(image)
                // console.log(renderImageCard(image))
            })

            lightbox.refresh()
            
            // window.scrollBy({
            //     top: cardHeight * 2,
            //     behavior: "smooth",
            // });
        }     

        if (imageData.hits.length > 0) {
            refs.galleryActions.classList.remove('hidden')
        }else {
            refs.galleryActions.classList.add('hidden')
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }
     
    } catch(err) {
        if (err.code === 'ERR_BAD_REQUEST') {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }

        refs.loader.classList.add('hidden')
        refs.loadMore.classList.add('hidden')
    }
}

const loadMoreHandler = onVisibilityChange(refs.loadMore, loadMore)

// Handlers
refs.searchForm.addEventListener('submit', loadCards)
refs.loadMore.addEventListener('click', loadMore)

window.addEventListener('scroll', loadMoreHandler, false);