const express = require('express')
const {
    createSite,
    getSiteById,
    getSites,
    deleteSitebyId,
    updateSiteById
} = require('../controller/site.js');
const siteRouter = express.Router();

siteRouter.post('/', createSite)
siteRouter.get('/', getSites)
siteRouter.get('/:id', getSiteById)
siteRouter.delete('/:id', deleteSitebyId)
siteRouter.put('/:id', updateSiteById)

module.exports = siteRouter