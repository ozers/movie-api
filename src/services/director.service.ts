import { CreateDirector, Director, UpdateDirector } from '../models/director.model';
import { NotFoundError } from '../utils/errors';
import { DirectorModel } from '../models/director.mongoose';
import { createCacheService } from './cache.service';

// Yönetmenler için 15 dakikalık önbellek süresi
const directorCache = createCacheService('director', 900);

export const createDirector = async (director: CreateDirector): Promise<Director> => {
    const newDirector = new DirectorModel({
        ...director,
        isDeleted: false
    });

    const savedDirector = await newDirector.save();
    
    const directorObject = savedDirector.toObject();
    const directorDto = {
        id: directorObject._id,
        firstName: directorObject.firstName,
        lastName: directorObject.lastName,
        birthDate: directorObject.birthDate,
        bio: directorObject.bio,
        isDeleted: directorObject.isDeleted
    };
    
    // yeni yönetmeni all cache içine ekle (eğer cache varsa)
    const allDirectors = await directorCache.get<Director[]>('all');
    if (allDirectors) {
        // varolan cache'e yeni yönetmeni ekle ve tekrar cache'le
        allDirectors.push(directorDto);
        await directorCache.set('all', allDirectors);
    }
    return directorDto;
};

export const getAllDirectors = async (): Promise<Director[]> => {
    return await directorCache.wrap('all', async () => {
        const directorList = await DirectorModel.find({ isDeleted: false });
        
        return directorList.map(director => {
            const d = director.toObject();
            return {
                id: d._id,
                firstName: d.firstName,
                lastName: d.lastName,
                birthDate: d.birthDate,
                bio: d.bio,
                isDeleted: d.isDeleted
            };
        });
    });
};

export const getDirectorById = async (id: string): Promise<Director> => {
    // önce director:id:[UUID] cache kontrol et
    const cachedDirector = await directorCache.get<Director>(`id:${id}`);
    if (cachedDirector) {
        return cachedDirector;
    }
    
    // director:all cache kontrol et ve varsa oradan filtrele
    const allDirectors = await directorCache.get<Director[]>('all');
    if (allDirectors) {
        const director = allDirectors.find(d => d.id === id && !d.isDeleted);
        if (director) {
            // yönetmeni bulursan ID bazlı cache'e de yaz (lazy caching)
            await directorCache.set(`id:${id}`, director);
            return director;
        }
    }

    // hiç cache yoksa veya bulunamadıysa, db'den çek
    return await directorCache.wrap(`id:${id}`, async () => {
        // ve cache'e ekle
        const director = await DirectorModel.findById(id);
        if (!director || director.isDeleted) {
            throw new NotFoundError('Director not found');
        }
        
        const d = director.toObject();
        return {
            id: d._id,
            firstName: d.firstName,
            lastName: d.lastName,
            birthDate: d.birthDate,
            bio: d.bio,
            isDeleted: d.isDeleted
        };
    });
};

export const updateDirector = async (id: string, director: UpdateDirector): Promise<Director> => {
    if(!id) {
        throw new NotFoundError('Director ID is required');
    }

    const existingDirector = await DirectorModel.findById(id);
    if (!existingDirector || existingDirector.isDeleted) {
        throw new NotFoundError('Director not found');
    }

    Object.assign(existingDirector, director);
    existingDirector.isDeleted = false;
    
    const updatedDirector = await existingDirector.save();
    
    // güncellenmiş yönetmen objesini oluştur
    const d = updatedDirector.toObject();
    const directorDto = {
        id: d._id,
        firstName: d.firstName,
        lastName: d.lastName,
        birthDate: d.birthDate,
        bio: d.bio,
        isDeleted: d.isDeleted
    };
    
    // ID bazlı cache'i güncelle
    await directorCache.set(`id:${id}`, directorDto);
    
    // all cache'indeki yönetmeni güncelle (eğer cache varsa)
    const allDirectors = await directorCache.get<Director[]>('all');
    if (allDirectors) {
        // Yönetmeni güncelle
        const updatedDirectors = allDirectors.map(d => {
            if (d.id === id) {
                return directorDto;
            }
            return d;
        });
        await directorCache.set('all', updatedDirectors);
    }
    
    return directorDto;
};

export const deleteDirector = async (id: string, force: boolean = false): Promise<boolean> => {
    const director = await DirectorModel.findById(id);
    if (!director) {
        throw new NotFoundError('Director not found');
    }

    if (force) {
        await DirectorModel.deleteOne({ _id: id });
    } else {
        director.isDeleted = true;
        await director.save();
    }

    // ID bazlı cache'i temizle
    await directorCache.delete(`id:${id}`);
    
    // all cache'inden silinen yönetmeni çıkar (eğer cache varsa)
    const allDirectors = await directorCache.get<Director[]>('all');
    if (allDirectors) {
        // silinen yönetmeni cache'den tamamen kaldır
        const filteredDirectors = allDirectors.filter(d => d.id !== id);
        await directorCache.set('all', filteredDirectors);
    }

    return true;
};
