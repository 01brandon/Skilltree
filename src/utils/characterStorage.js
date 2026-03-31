// local storage utilities for skill data (client-side cache layer)
// firestore is the source of truth - this is for offline/fast reads

var STORAGE_KEY = 'skilltree_skills_cache'
var SESSION_KEY = 'skilltree_sessions_cache'

// read all cached skills for a user
export function readSkills(userId) {
  try {
    var raw = localStorage.getItem(STORAGE_KEY + '_' + userId)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

// write skills array to local cache
export function writeSkills(userId, skills) {
  try {
    localStorage.setItem(STORAGE_KEY + '_' + userId, JSON.stringify(skills))
  } catch (e) {
    console.warn('cache write failed', e)
  }
}

// read a single skill by id from cache
export function readSkillById(userId, skillId) {
  var skills = readSkills(userId)
  return skills.find(function (s) { return s.id === skillId }) || null
}

// upsert a skill in cache - adds or updates by id
export function upsertSkill(userId, skill) {
  var skills = readSkills(userId)
  var idx    = skills.findIndex(function (s) { return s.id === skill.id })
  if (idx >= 0) {
    skills[idx] = skill
  } else {
    skills.push(skill)
  }
  writeSkills(userId, skills)
}

// remove a skill from cache
export function removeSkill(userId, skillId) {
  var skills = readSkills(userId).filter(function (s) { return s.id !== skillId })
  writeSkills(userId, skills)
}

// clear all cached data for a user (call on logout)
export function clearCache(userId) {
  localStorage.removeItem(STORAGE_KEY + '_' + userId)
  localStorage.removeItem(SESSION_KEY + '_' + userId)
}

// read cached study sessions
export function readSessions(userId) {
  try {
    var raw = localStorage.getItem(SESSION_KEY + '_' + userId)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

// write sessions to cache
export function writeSessions(userId, sessions) {
  try {
    localStorage.setItem(SESSION_KEY + '_' + userId, JSON.stringify(sessions))
  } catch (e) {
    console.warn('session cache write failed', e)
  }
}