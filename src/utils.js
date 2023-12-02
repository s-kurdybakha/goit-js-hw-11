import axios from "axios";

const PIXABAY_API_URL = 'https://pixabay.com/api/';
const PIXABAY_API_KEY = '41017518-95b21bb0f6248f508a9feed4e';

function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
}

export function onVisibilityChange(el, callback) {
    var old_visible;
    return function () {
        var visible = isElementInViewport(el);
        if (visible != old_visible) {
            old_visible = visible;
            if (typeof callback == 'function' && visible === true) {
                callback();
            }
        }
    }
}

export function fetchImages(query, page) {
    return new Promise((resolve, reject) => {
        axios.get(`${PIXABAY_API_URL}`, {
            params: {
                key: PIXABAY_API_KEY,
                q: query,
                page: page || 1,
                type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
            }
        })
            .then((response) => {
                resolve(response.data)
            })
            .catch((response) => {
                reject(response)
            })
    })
}

export function renderImageCard(image) {
    return `
        <a href="${image.largeImageURL}" class="gallery-item">
            <div class="photo-card">
                <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b>
                        <span>${image.likes}</span>
                    </p>
                    <p class="info-item">
                        <b>Views</b>
                        <span>${image.views}</span>
                    </p>
                    <p class="info-item">
                        <b>Comments</b>
                        <span>${image.comments}</span>
                    </p>
                    <p class="info-item">
                        <b>Downloads</b>
                        <span>${image.downloads}</span>
                    </p>
                </div>
            </div>
        </a>
    `
}