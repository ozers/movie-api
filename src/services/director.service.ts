import { CreateDirector, Director, UpdateDirector } from '../models/director.model';
import { NotFoundError } from '../utils/errors';
import { DirectorModel } from '../models/director.mongoose';

export const createDirector = async (director: CreateDirector): Promise<Director> => {
    const newDirector = new DirectorModel({
        ...director,
        isDeleted: false
    });

    const savedDirector = await newDirector.save();
    
    const directorObject = savedDirector.toObject();
    return {
        id: directorObject._id,
        firstName: directorObject.firstName,
        lastName: directorObject.lastName,
        birthDate: directorObject.birthDate,
        bio: directorObject.bio,
        isDeleted: directorObject.isDeleted
    };
};

export const getAllDirectors = async (): Promise<Director[]> => {
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
};

export const getDirectorById = async (id: string): Promise<Director> => {
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
    
    const d = updatedDirector.toObject();
    return {
        id: d._id,
        firstName: d.firstName,
        lastName: d.lastName,
        birthDate: d.birthDate,
        bio: d.bio,
        isDeleted: d.isDeleted
    };
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

    return true;
};
