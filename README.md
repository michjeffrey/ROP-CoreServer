# Reolink Open Platform (ROP) v1.0 Documentation

Welcome to the documentation for Reolink Open Platform (ROP) v1.0. This platform is designed to facilitate the redesign and integration of Reolink devices by our partners. The following documents provide a comprehensive guide to the platform, including its architecture, deployment, interfaces, and security design.

## Table of Contents
1. [Introduction to Reolink Open Platform v1.0](#1-introduction-to-reolink-open-platform-v10)
2. [Manual of Reolink Open Platform v1.0](#2-manual-of-reolink-open-platform-v10)
3. [Interfaces of Reolink Open Platform v1.0](#3-interfaces-of-reolink-open-platform-v10)
4. [Security Design of Reolink Open Platform v1.0](#4-security-design-of-reolink-open-platform-v10)

---

## 1. Introduction to Reolink Open Platform v1.0
The Introduction document presents the objective of ROP and provides an overview of the platform. It includes a glossary of terms, a block diagram of the system, details on the core server functions, authenticator, and deployment recommendations.

### Highlights
- **Objective**: To enable Reolink partners to redesign and integrate devices seamlessly.
- **Core Server**: Fully open-source, serving as the central component of ROP.
- **Device Compatibility**: Supports a wide range of Reolink cameras and devices.
- **Client Development**: Partners have the freedom to develop and maintain their own client applications.


---

## 2. Manual of Reolink Open Platform v1.0
The Manual is a practical guide for server deployment, usage, and device installation. It details the hardware and software requirements, installation steps, server functions, important configuration items, and instructions for optional components such as the Client Gateway and Authenticator.

### Key Sections
- **Deployment**: Outlines the steps to set up the Core Server for the first time.
- **Server Functions**: Lists available functions and their prerequisites.
- **Configuration**: Describes important configuration items and server ports.

---

## 3. Interfaces of Reolink Open Platform v1.0
This document details the interfaces provided by ROP. It includes protocols for configuration and streaming, error codes, and comprehensive descriptions of HTTP and RTSP interfaces for device interaction.

### Interface Overview
- **Device Initialization**: Procedures for starting device sessions.
- **Firmware Updates**: Steps for uploading and updating device firmware.
- **Live View and Playback**: How to request and authenticate streams.

---

## 4. Security Design of Reolink Open Platform v1.0
Security is paramount in ROP. This document outlines the security principles, client security design, device security measures, stream encryption options, and alarm notification security.

### Security Features
- **No Backdoors**: Reolink assures no backdoors in the platform.
- **Authentication**: Details on mutual authentication between devices and the Core Server.
- **Encryption**: Offers options for full, selective, and non-encryption for streams.