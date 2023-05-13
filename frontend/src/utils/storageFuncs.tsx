type Templates = {[char: string]: string[]}
type Categories = string[]
type ScoreboardMode = string


function setScoreboardMode(mode: ScoreboardMode): void {
    sessionStorage.setItem("scoreboardMode", mode)
}

function getScoreboardMode(): ScoreboardMode | null {
    let mode = localStorage.getItem("scoreboardMode")
    return mode    
}

function setSessionCategories(categories: Categories): void {
    sessionStorage.setItem("categories", JSON.stringify(categories))
}

function setLocalTemplates(templates: Templates): void {
    localStorage.setItem("templates", JSON.stringify(templates))
}

function getSessionCategories(): Categories {
    const strCategories = sessionStorage.getItem("categories")
    return strCategories? JSON.parse(strCategories): []
}

function getLocalTemplates(): Templates {
    const strTemplates = localStorage.getItem("templates")
    return strTemplates? JSON.parse(strTemplates): {}
}

function getTemplateCategories(templateKey: string): Categories {
    const templates = getLocalTemplates()
    const template = templates[templateKey]
    return template
}

export {
    setScoreboardMode,
    getScoreboardMode,
    setSessionCategories,
    setLocalTemplates,
    getSessionCategories,
    getLocalTemplates,
    getTemplateCategories
}